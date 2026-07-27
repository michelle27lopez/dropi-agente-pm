import type { Metadata } from "next";
import Link from "next/link";
import { cargarFoto, cargarReglas } from "@/lib/recolecciones/datos";
import { armarTablero } from "@/lib/recolecciones/tablero";
import { ETIQUETA_VEREDICTO } from "@/lib/recolecciones/elegibilidad";
import ArmarSolicitud from "./ArmarSolicitud";
// Mapa.tsx sigue en la carpeta: es la base del port, todavía incompleta. No se
// monta acá para no mostrar dos mapas distintos en la misma página.
import "./recolecciones.css";

// Control de Recolecciones — tablero del día.
//
// La pantalla principal ya no es el mapa. Se verificó que la geocodificación
// devuelve "una vía con ese nombre" y no la dirección (quitar el número mueve
// el punto entre 959 y 2.688 m), así que el mapa no puede sostener la decisión
// de a qué puerta ir. Lo que sí la sostiene es la lista: por transportadora,
// qué se le puede pedir hoy, y qué queda fuera y por qué.
//
// El mapa vive DENTRO de esta página (componente Mapa), al final: primero se
// decide con la lista, después se mira dónde queda. Dejó de ser un iframe con
// su propio sistema visual y su propia carga de datos.

export const metadata: Metadata = {
  title: "Control de recolecciones · Logística — Dropi",
  description: "Qué carga está lista para recoger, por transportadora.",
};

export const dynamic = "force-dynamic";

const fmt = (n: number) => n.toLocaleString("es-CO");

// Ancla estable para saltar a una transportadora desde la franja de arriba.
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function RecoleccionesPage() {
  const foto = await cargarFoto();
  const reglas = await cargarReglas();
  const { filas, dropi } = armarTablero(foto, reglas);

  const totalElegibles = filas.reduce((s, f) => s + f.elegibles.length, 0);
  const totalPaquetes = filas.reduce((s, f) => s + f.paquetes_elegibles, 0);
  const totalCandidatas = filas.reduce((s, f) => s + f.candidatas, 0);
  const sinUbicacion = filas.reduce((s, f) => s + f.sin_ubicacion, 0);

  return (
    <main className="rec">
      <header className="rec-head">
        <div>
          <h1>Control de recolecciones</h1>
          <p className="rec-sub">
            {foto.fecha
              ? <>Carga del <b>{foto.fecha}</b> · {fmt(foto.totales.bodegas)} bodegas · {fmt(foto.totales.guias)} guías</>
              : <>Sin datos cargados</>}
          </p>
        </div>
        <Link className="rec-btn" href="/proyectos/logistica/recolecciones/mapa">Ver el mapa</Link>
      </header>

      {/* De dónde salen los datos. Nunca implícito: la diferencia entre la base
          y un archivo local decide si lo que ves es de hoy o de cuando alguien
          corrió un script en su máquina. */}
      <div className={`rec-fuente rec-fuente--${foto.fuente}`}>
        {foto.fuente === "base" && <>Datos desde la base · se actualizan al importar el export</>}
        {foto.fuente === "archivo" && (
          <>Datos desde el <b>archivo local</b> del pipeline, no desde la base. La migración{" "}
            <code>037</code> todavía no corrió: nada de lo que hagas acá se guarda.</>
        )}
        {foto.fuente === "vacio" && (
          <>No hay datos. Corré la migración <code>037_recolecciones.sql</code> e importá el
            export desde el mapa.</>
        )}
      </div>

      {foto.bodegas.length > 0 && (
        <>
          {/* Dónde está el trabajo. NO colapsa las transportadoras chicas: su
              flujo es idéntico al de las grandes —armar, generar, enviar— así
              que esconderlas solo agregaría un clic. Esto es un atajo a las que
              concentran el volumen, no una jerarquía que las degrade. */}
          {(() => {
            const conCarga = filas.filter(f => f.elegibles.length > 0);
            const foco: typeof conCarga = [];
            let acumulado = 0;
            for (const f of conCarga) {
              foco.push(f);
              acumulado += f.paquetes_elegibles;
              if (acumulado >= totalPaquetes * 0.8) break;
            }
            if (foco.length < 2 || foco.length === conCarga.length) return null;
            return (
              <nav className="rec-foco" aria-label="Transportadoras que concentran el volumen">
                <span className="rec-foco-lbl">
                  El {Math.round(100 * acumulado / totalPaquetes)}% de los paquetes está en{" "}
                  {foco.length} de {conCarga.length}:
                </span>
                {foco.map(f => (
                  <a key={f.transportadora} href={`#t-${slug(f.transportadora)}`}>
                    {f.transportadora} <b className="tnum">{fmt(f.paquetes_elegibles)}</b>
                  </a>
                ))}
              </nav>
            );
          })()}

          <section className="rec-kpis">
            <div className="rec-kpi">
              <b className="tnum">{fmt(totalElegibles)}</b>
              <span>Bodegas para pedir hoy</span>
              <small>de {fmt(totalCandidatas)} con carga</small>
            </div>
            <div className="rec-kpi">
              <b className="tnum">{fmt(totalPaquetes)}</b>
              <span>Paquetes que se recogerían</span>
              <small>
                {foto.totales.guias
                  ? `${Math.round(100 * totalPaquetes / foto.totales.guias)}% del total`
                  : "—"}
              </small>
            </div>
            <div className="rec-kpi">
              <b className="tnum">{fmt(dropi.bodegas)}</b>
              <span>Recolección Dropi</span>
              <small>
                {dropi.bodegas
                  ? `${fmt(dropi.paquetes)} paquetes · vamos nosotros`
                  : "falta el dato de fulfillment"}
              </small>
            </div>
            {/* Calidad del dato, no operación: por eso se ve distinto. */}
            <div className="rec-kpi rec-kpi--dato">
              <b className="tnum">{fmt(sinUbicacion)}</b>
              <span>Sin ubicación confiable</span>
              <small>van con la dirección de texto</small>
            </div>
          </section>

          <section className="rec-lista">
            {filas.map(f => {
              const pct = f.guias_totales
                ? Math.round(100 * f.paquetes_elegibles / f.guias_totales) : 0;
              return (
                <article key={f.transportadora} id={`t-${slug(f.transportadora)}`} className="rec-t">
                  <div className="rec-t-head">
                    <h2>{f.transportadora}</h2>
                    <span className="rec-t-tot tnum">
                      {fmt(f.candidatas)} bodegas · {fmt(f.guias_totales)} guías
                    </span>
                  </div>

                  <div className="rec-t-body">
                    <div className="rec-t-cifra">
                      <b className="tnum">{fmt(f.elegibles.length)}</b>
                      <span>elegibles</span>
                    </div>
                    <div className="rec-t-cifra">
                      <b className="tnum">{fmt(f.paquetes_elegibles)}</b>
                      <span>paquetes</span>
                    </div>

                    <div className="rec-t-barra" title={`${pct}% del volumen de esta transportadora`}>
                      <i style={{ width: `${pct}%` }} />
                    </div>

                    <div className="rec-t-reglas">
                      <span className="rec-chip">mín. {f.min_paquetes} paquetes</span>
                      {f.sin_ubicacion > 0 && (
                        <span className="rec-chip rec-chip--dato">{f.sin_ubicacion} sin ubicar</span>
                      )}
                    </div>
                  </div>

                  {/* Por qué quedó fuera cada bodega. Si el operador no puede
                      discutirle a la regla, arma la lista por su cuenta en Excel. */}
                  {Object.keys(f.por_motivo).length > 0 && (
                    <p className="rec-t-fuera">
                      Quedan fuera:{" "}
                      {Object.entries(f.por_motivo).map(([motivo, n], i) => (
                        <span key={motivo}>
                          {i > 0 && " · "}
                          <b>{n}</b>{" "}
                          {ETIQUETA_VEREDICTO[motivo as keyof typeof ETIQUETA_VEREDICTO] ?? motivo}
                        </span>
                      ))}
                    </p>
                  )}

                  {f.elegibles.length > 0 && (
                    <details className="rec-t-detalle">
                      <summary>Armar la solicitud · {f.elegibles.length} bodegas</summary>
                      <ArmarSolicitud
                        transportadora={f.transportadora}
                        elegibles={f.elegibles}
                        minInicial={f.min_paquetes}
                      />
                    </details>
                  )}
                </article>
              );
            })}
          </section>

          {/* El mapa completo.
              Bajar el mapa de jerarquía —porque la geocodificación tiene 5 km de
              error mediano y no puede decidir a qué puerta ir— no era razón para
              perder lo que el mapa sí hace bien: navegar por territorio, buscar,
              filtrar, ver el detalle de una bodega y subir el export.

              No es un placeholder a la espera de un port: este HTML ya consume
              /api/logistica/recolecciones (la base), con el JSON de public/ solo
              como respaldo, y ya trae la ingesta conectada a /importar. O sea que
              funciona igual en producción. Lo que queda de deuda es visual —dos
              sistemas de estilo conviviendo—, no funcional, y eso no justifica
              reescribir 750 líneas. Mapa.tsx queda como base por si algún día se
              decide unificar el estilo. */}
          {/* No se embebe acá: en una caja chica el mapa queda inservible —tiene
              su propia navegación por territorio, filtros y panel de detalle— y
              obliga a hacer scroll dentro del scroll. Va a su propia página, a
              pantalla completa. */}
          <section id="mapa" className="rec-mapa-cta">
            <div>
              <h2>Mapa de recolecciones</h2>
              <p>
                Navegá por territorio, buscá una bodega, filtrá por transportadora,
                mirá el detalle o subí el export del día. Lee de la misma base que
                este tablero.
              </p>
            </div>
            <Link className="rec-btn rec-btn--fuerte" href="/proyectos/logistica/recolecciones/mapa">
              Abrir el mapa →
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
