"use client";

import { useCallback, useState } from "react";
import { ExternalLink, Check, Copy, ChevronRight, AlertTriangle } from "lucide-react";
import {
  ticketsJira,
  faltantes,
  urlJira,
  urlComentario,
  urlDoc,
  type Campo,
  type TicketJira,
} from "@/app/proyectos/logistica/_lib/jira-documentacion";

/**
 * HOJA DE LLENADO DE JIRA — para tener abierta al lado del ticket.
 *
 * Esta pantalla existe por una limitación, no por gusto: en PRM (Polaris) no se
 * puede escribir NINGÚN campo por API. Ni la descripción, ni el assignee, ni un
 * customfield. Así que los 11 documentos se publicaron como comentario y la
 * clasificación hay que ponerla a mano, ticket por ticket.
 *
 * El trabajo de esta página es que ese "a mano" no sea también "a ojo": cada
 * valor sale con el texto EXACTO de la opción del desplegable y un botón que lo
 * pone en el portapapeles. Un valor que no calce obliga a buscarlo, que es
 * justo lo que esto evita.
 *
 * Lo que ya está puesto se muestra en verde y NO se puede copiar. Es a
 * propósito: el riesgo real acá no es dejar un campo vacío, es sobrescribir uno
 * que estaba bien.
 */

// ── Copiar ───────────────────────────────────────────────────────────────────
// Tres estados, no dos. El fallo importa: `navigator.clipboard` solo existe en
// contexto seguro, así que en un http:// que no sea localhost esto no funciona y
// hay que decirlo en vez de fingir que copió.
type Estado = "listo" | "copiado" | "error";

function useCopiar() {
  const [estado, setEstado] = useState<Estado>("listo");

  const copiar = useCallback(async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setEstado("copiado");
    } catch {
      setEstado("error");
    }
    setTimeout(() => setEstado("listo"), 2000);
  }, []);

  return { estado, copiar };
}

function BotonCopiar({
  texto,
  obtener,
  label = "copiar",
}: {
  /** Texto ya disponible. */
  texto?: string;
  /** O una función que lo trae (para el markdown, que se pide al servidor). */
  obtener?: () => Promise<string>;
  label?: string;
}) {
  const { estado, copiar } = useCopiar();
  const [cargando, setCargando] = useState(false);

  const alHacerClic = async () => {
    if (texto !== undefined) return copiar(texto);
    if (!obtener) return;
    setCargando(true);
    try {
      copiar(await obtener());
    } catch {
      // El fetch falló: se reporta con el mismo canal que un clipboard caído.
      copiar("");
    } finally {
      setCargando(false);
    }
  };

  const copiado = estado === "copiado";
  const error = estado === "error";

  return (
    <button
      type="button"
      onClick={alHacerClic}
      disabled={cargando}
      style={{
        ...BTN,
        color: error ? "var(--red, #dc2626)" : copiado ? "var(--green, #16a34a)" : "var(--muted, #64748b)",
        borderColor: error
          ? "var(--red, #dc2626)"
          : copiado
            ? "var(--green, #16a34a)"
            : "var(--border, #e2e8f0)",
      }}
    >
      {copiado ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
      {cargando ? "…" : error ? "no se pudo" : copiado ? "copiado" : label}
    </button>
  );
}

// ── Un campo ─────────────────────────────────────────────────────────────────

function FilaCampo({ campo }: { campo: Campo }) {
  return (
    <div style={FILA}>
      <span style={NOMBRE_CAMPO}>{campo.nombre}</span>
      <code style={VALOR}>{campo.valor}</code>
      <span style={CF} title={campo.opcion ? `opción ${campo.opcion}` : undefined}>
        {campo.cf.replace("customfield_", "cf_")}
      </span>
      <BotonCopiar texto={campo.valor} />
    </div>
  );
}

// ── Una tarjeta ──────────────────────────────────────────────────────────────

function Tarjeta({ t }: { t: TicketJira }) {
  const porLlenar = t.campos.filter((c) => !c.puesto);
  const puestos = t.campos.filter((c) => c.puesto);
  const completo = porLlenar.length === 0;

  // Los completos arrancan cerrados: están para mostrar que se revisaron, no
  // para trabajarlos. Los demás, abiertos.
  const [abierto, setAbierto] = useState(!completo);
  const [verDoc, setVerDoc] = useState(false);
  const [doc, setDoc] = useState<string | null>(null);

  const traerDoc = useCallback(async () => {
    if (doc !== null) return doc;
    const r = await fetch(urlDoc(t.doc));
    if (!r.ok) throw new Error(`no se pudo leer ${t.doc}.md`);
    const texto = await r.text();
    setDoc(texto);
    return texto;
  }, [doc, t.doc]);

  const mostrarDoc = async () => {
    if (!verDoc && doc === null) {
      try {
        await traerDoc();
      } catch {
        setDoc("No se pudo cargar el documento.");
      }
    }
    setVerDoc(!verDoc);
  };

  return (
    <article style={{ ...TARJETA, borderColor: completo ? "var(--border, #e2e8f0)" : "var(--border, #e2e8f0)" }}>
      <header style={CABECERA}>
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          style={TOGGLE}
        >
          <ChevronRight size={14} strokeWidth={2.4} style={{ transform: abierto ? "rotate(90deg)" : "none", flex: "none" }} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <strong style={CLAVE}>{t.clave}</strong>
            <span style={TITULO_TICKET}>{t.titulo}</span>
          </div>
          <div style={META}>
            {t.tipo}
            {t.hereda && <> · hereda de <strong style={{ fontWeight: 600 }}>{t.hereda}</strong></>}
            {" · "}
            <a href={urlComentario(t.clave, t.comentario)} target="_blank" rel="noreferrer" style={ENLACE_SUAVE}>
              documentación en el comentario {t.comentario}
            </a>
          </div>
        </div>

        <span style={completo ? PILL_OK : PILL_FALTA}>
          {completo ? "completo" : `faltan ${porLlenar.length}`}
        </span>

        <a href={urlJira(t.clave)} target="_blank" rel="noreferrer" style={BTN_JIRA}>
          abrir en Jira <ExternalLink size={12} strokeWidth={2} />
        </a>
      </header>

      {abierto && (
        <>
          {t.nota && (
            <p style={NOTA}>
              <AlertTriangle size={13} strokeWidth={2} style={{ flex: "none", marginTop: 2 }} />
              <span>{t.nota}</span>
            </p>
          )}

          {porLlenar.length > 0 && (
            <div style={BLOQUE}>
              <div style={ETIQUETA_BLOQUE}>Campos por poner</div>
              {porLlenar.map((c) => (
                <FilaCampo key={c.cf} campo={c} />
              ))}
            </div>
          )}

          {puestos.length > 0 && (
            <p style={YA_PUESTOS}>
              <Check size={13} strokeWidth={2.5} style={{ flex: "none", color: "var(--green, #16a34a)" }} />
              <span>
                Ya están puestos y no hay que tocarlos:{" "}
                {puestos.map((c) => c.nombre).join(" · ")}
              </span>
            </p>
          )}

          <div style={{ ...BLOQUE, marginBottom: 0 }}>
            <div style={{ ...ETIQUETA_BLOQUE, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ flex: 1 }}>Descripción</span>
              <button type="button" onClick={mostrarDoc} style={{ ...BTN, borderColor: "var(--border, #e2e8f0)" }}>
                {verDoc ? "ocultar" : "ver"}
              </button>
              <BotonCopiar obtener={traerDoc} label="copiar markdown" />
            </div>
            {verDoc && <pre style={PRE}>{doc ?? "…"}</pre>}
          </div>
        </>
      )}
    </article>
  );
}

// ── La pantalla ──────────────────────────────────────────────────────────────

export default function DocumentacionJiraView() {
  const pendientes = ticketsJira.filter((t) => faltantes(t) > 0);
  const totalCampos = pendientes.reduce((n, t) => n + faltantes(t), 0);

  return (
    <main style={MAIN}>
      <h1 style={H1}>Llenar Jira a mano</h1>

      <p style={INTRO}>
        Los 11 documentos ya están publicados como comentario en cada ticket. Lo que queda es la
        clasificación, y <strong>eso no se puede escribir por API</strong>: en Polaris ni la descripción,
        ni el asignado, ni un customfield entran — los tres devuelven{" "}
        <em>“cannot be set, it is not on the appropriate screen”</em>. Así que esta página es para tenerla
        abierta al lado de Jira: abre el ticket, copia y pega.
      </p>

      <p style={INTRO}>
        <strong>Ningún valor de acá es inventado.</strong> Cada uno se hereda del ticket padre — las dos
        fases de tarifas de PRM-1362, los cuatro carriers de PRM-1364 — así que copiarlo es lo correcto,
        no una aproximación.
      </p>

      <div style={RESUMEN}>
        <span>
          <strong style={{ fontSize: 22, fontWeight: 700 }}>{totalCampos}</strong> campos por poner
        </span>
        <span style={{ color: "var(--muted, #64748b)" }}>
          en {pendientes.length} de {ticketsJira.length} tickets
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ticketsJira.map((t) => (
          <Tarjeta key={t.clave} t={t} />
        ))}
      </div>

      <section style={PIE_NOTAS}>
        <h2 style={H2}>Lo que esta página no cubre</h2>
        <ul style={LISTA}>
          <li>
            <strong>Los 8 campos de scoring</strong> (<code style={CODE_INLINE}>cf_11774</code>,{" "}
            <code style={CODE_INLINE}>11778</code>, <code style={CODE_INLINE}>11593</code>,{" "}
            <code style={CODE_INLINE}>11594</code>, <code style={CODE_INLINE}>11860</code>–
            <code style={CODE_INLINE}>11863</code>, valores 1–5). No se pueden leer sus nombres porque el
            metadata de PRM también está bloqueado, y copiarlos entre tickets falsearía el ranking del
            roadmap. El scoring lo pone el PM viendo el conjunto.
          </li>
          <li>
            <strong>Las 3 épicas de PROD</strong> (235 · 240 · 1127) ya quedaron con descripción y con
            Juan como asignado, por API. En PROD sí se puede escribir.
          </li>
          <li>
            <strong>INVS-17</strong> quedó sin documentar: la cuenta <code style={CODE_INLINE}>producto@dropi.co</code>{" "}
            no tiene permiso ni para editar ni para comentar en ese proyecto. Eso sí lo arregla un admin de
            Jira — no es una limitación estructural como la de PRM.
          </li>
          <li>
            <strong>PRM-1297 sigue sin un solo enlace</strong> ni épica en DROP/PROD, siendo la iniciativa
            #1 del Delivery Roadmap. Crear esos enlaces define la estructura del árbol de producto: es
            decisión, no llenado.
          </li>
        </ul>
      </section>
    </main>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────
// Inline y con respaldo en píxeles: `tablero.css` define los tokens bajo
// `.log-root`, y si alguno no resuelve la declaración se descarta en silencio.
// Con el fallback lo peor que pasa es que se vea bien.

const MAIN: React.CSSProperties = { padding: "28px 32px 64px", maxWidth: 1000 };

const H1: React.CSSProperties = { fontSize: 26, fontWeight: 700, color: "var(--text, #0f172a)", margin: "0 0 12px" };

const H2: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "var(--text, #0f172a)", margin: "0 0 10px" };

const INTRO: React.CSSProperties = {
  fontSize: 13.5,
  lineHeight: 1.6,
  color: "var(--muted, #64748b)",
  margin: "0 0 10px",
  maxWidth: 760,
};

const RESUMEN: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 10,
  padding: "12px 16px",
  margin: "18px 0 20px",
  background: "var(--soft, #f8fafc)",
  border: "1px solid var(--border, #e2e8f0)",
  borderRadius: "var(--radius, 10px)",
  fontSize: 13,
  color: "var(--text, #0f172a)",
};

const TARJETA: React.CSSProperties = {
  background: "var(--card, #fff)",
  border: "1px solid var(--border, #e2e8f0)",
  borderRadius: "var(--radius, 10px)",
  padding: "14px 16px",
};

const CABECERA: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: 8 };

const TOGGLE: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "2px 0 0",
  color: "var(--muted, #64748b)",
  display: "flex",
};

const CLAVE: React.CSSProperties = {
  fontSize: 13.5,
  fontWeight: 700,
  color: "var(--text, #0f172a)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const TITULO_TICKET: React.CSSProperties = { fontSize: 13.5, color: "var(--text, #0f172a)" };

const META: React.CSSProperties = { fontSize: 11.5, color: "var(--muted, #64748b)", marginTop: 3 };

const ENLACE_SUAVE: React.CSSProperties = { color: "var(--muted, #64748b)", textDecoration: "underline" };

const PILL_BASE: React.CSSProperties = {
  flex: "none",
  fontSize: 11,
  fontWeight: 600,
  padding: "3px 9px",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

const PILL_OK: React.CSSProperties = { ...PILL_BASE, background: "#dcfce7", color: "#15803d" };

const PILL_FALTA: React.CSSProperties = { ...PILL_BASE, background: "#fef3c7", color: "#a16207" };

const BTN_JIRA: React.CSSProperties = {
  flex: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 11.5,
  fontWeight: 600,
  padding: "5px 10px",
  borderRadius: 7,
  border: "1px solid var(--border, #e2e8f0)",
  color: "var(--text, #0f172a)",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const NOTA: React.CSSProperties = {
  display: "flex",
  gap: 7,
  fontSize: 12.5,
  lineHeight: 1.55,
  color: "#92400e",
  background: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: 8,
  padding: "9px 11px",
  margin: "12px 0 0",
};

const BLOQUE: React.CSSProperties = { marginTop: 14 };

const ETIQUETA_BLOQUE: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  color: "var(--muted, #64748b)",
  marginBottom: 7,
};

const FILA: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "6px 0",
  borderTop: "1px solid var(--border, #e2e8f0)",
  fontSize: 12.5,
  flexWrap: "wrap",
};

const NOMBRE_CAMPO: React.CSSProperties = {
  width: 108,
  flex: "none",
  fontWeight: 600,
  color: "var(--text, #0f172a)",
};

const VALOR: React.CSSProperties = {
  flex: 1,
  minWidth: 200,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 12,
  background: "var(--soft, #f8fafc)",
  border: "1px solid var(--border, #e2e8f0)",
  borderRadius: 6,
  padding: "3px 7px",
  color: "var(--text, #0f172a)",
  // El doble espacio de "OKR  3 - KR 1" tiene que verse: si el navegador lo
  // colapsa, quien copie a mano lo escribe mal y el valor no calza.
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const CF: React.CSSProperties = {
  flex: "none",
  fontSize: 10.5,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  color: "var(--muted, #64748b)",
};

const BTN: React.CSSProperties = {
  flex: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: "inherit",
  padding: "4px 9px",
  borderRadius: 6,
  border: "1px solid var(--border, #e2e8f0)",
  background: "var(--card, #fff)",
  color: "var(--muted, #64748b)",
  cursor: "pointer",
};

const YA_PUESTOS: React.CSSProperties = {
  display: "flex",
  gap: 7,
  alignItems: "flex-start",
  fontSize: 12,
  lineHeight: 1.5,
  color: "var(--muted, #64748b)",
  margin: "12px 0 0",
};

const PRE: React.CSSProperties = {
  margin: "8px 0 0",
  padding: "12px 14px",
  background: "var(--soft, #f8fafc)",
  border: "1px solid var(--border, #e2e8f0)",
  borderRadius: 8,
  fontSize: 11.5,
  lineHeight: 1.55,
  maxHeight: 380,
  overflow: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  color: "var(--text, #0f172a)",
};

const PIE_NOTAS: React.CSSProperties = {
  marginTop: 28,
  paddingTop: 20,
  borderTop: "1px solid var(--border, #e2e8f0)",
};

const LISTA: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  fontSize: 12.5,
  lineHeight: 1.65,
  color: "var(--muted, #64748b)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const CODE_INLINE: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 11.5,
  background: "var(--soft, #f8fafc)",
  padding: "1px 4px",
  borderRadius: 4,
};
