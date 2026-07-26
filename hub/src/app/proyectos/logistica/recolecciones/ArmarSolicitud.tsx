"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Candidata } from "@/lib/recolecciones/elegibilidad";
import { generarCsv, nombreArchivo, mensajeSolicitud } from "@/lib/recolecciones/archivo";

// Armar la solicitud de UNA transportadora.
//
// La selección es MASIVA, no bodega por bodega: son 363 candidatas en
// Interrapidísimo, y marcar 363 casillas no es trabajo, es castigo. El operador
// mueve filtros —municipio, mínimo de paquetes, si exige ubicación verificada—
// y ve al instante cuántas bodegas y cuántos paquetes quedan.
//
// Las excepciones individuales existen igual (siempre hay una bodega que hoy no
// va), pero son la excepción y por eso el botón de quitar es discreto y
// reversible, no una casilla por fila compitiendo con los filtros.

type Props = {
  transportadora: string;
  elegibles: Candidata[];
  minInicial: number;
};

type Orden = "paquetes" | "nombre" | "municipio";
type Aviso = { texto: string; tono: "ok" | "error" } | null;

const fmt = (n: number) => n.toLocaleString("es-CO");
const VISIBLES = 60;

export default function ArmarSolicitud({ transportadora, elegibles, minInicial }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [municipio, setMunicipio] = useState("todos");
  const [minPaquetes, setMinPaquetes] = useState(minInicial);
  const [soloUbicadas, setSoloUbicadas] = useState(false);
  const [quitadas, setQuitadas] = useState<Set<string>>(new Set());
  const [orden, setOrden] = useState<Orden>("paquetes");
  const [aviso, setAviso] = useState<Aviso>(null);
  const [copiaManual, setCopiaManual] = useState<string | null>(null);

  const buscador = useRef<HTMLInputElement>(null);
  const claveGuardado = `rec:filtros:${transportadora}`;

  // Los filtros sobreviven a una recarga. Armar la selección de 363 bodegas y
  // perderla por refrescar sin querer es la clase de fricción que hace que la
  // gente vuelva a Excel.
  useEffect(() => {
    try {
      const g = sessionStorage.getItem(claveGuardado);
      if (!g) return;
      const f = JSON.parse(g);
      if (typeof f.busqueda === "string") setBusqueda(f.busqueda);
      if (typeof f.municipio === "string") setMunicipio(f.municipio);
      if (typeof f.minPaquetes === "number") setMinPaquetes(f.minPaquetes);
      if (typeof f.soloUbicadas === "boolean") setSoloUbicadas(f.soloUbicadas);
      if (Array.isArray(f.quitadas)) setQuitadas(new Set(f.quitadas));
      if (f.orden) setOrden(f.orden);
    } catch { /* sessionStorage bloqueado: se sigue sin filtros guardados */ }
  }, [claveGuardado]);

  useEffect(() => {
    try {
      sessionStorage.setItem(claveGuardado, JSON.stringify({
        busqueda, municipio, minPaquetes, soloUbicadas, orden,
        quitadas: [...quitadas],
      }));
    } catch { /* ídem */ }
  }, [claveGuardado, busqueda, municipio, minPaquetes, soloUbicadas, orden, quitadas]);

  // El aviso de "copiado" se limpia solo. Con cleanup: si el usuario aprieta
  // otra vez antes de los 2s, el timer viejo no borra el mensaje nuevo.
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 2600);
    return () => clearTimeout(t);
  }, [aviso]);

  const municipios = useMemo(
    () => [...new Set(elegibles.map(c => c.municipio))].filter(Boolean).sort(),
    [elegibles],
  );

  const seleccionadas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const pasa = elegibles.filter(c => {
      if (quitadas.has(c.warehouse_id)) return false;
      if (c.paquetes < minPaquetes) return false;
      if (municipio !== "todos" && c.municipio !== municipio) return false;
      if (soloUbicadas && !c.ubicacion_confiable) return false;
      if (q && !(`${c.nombre} ${c.municipio} ${c.direccion}`.toLowerCase().includes(q))) return false;
      return true;
    });
    if (orden === "nombre") return pasa.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    if (orden === "municipio")
      return pasa.sort((a, b) => a.municipio.localeCompare(b.municipio, "es") || b.paquetes - a.paquetes);
    return pasa.sort((a, b) => b.paquetes - a.paquetes);
  }, [elegibles, busqueda, municipio, minPaquetes, soloUbicadas, quitadas, orden]);

  const paquetes = seleccionadas.reduce((s, c) => s + c.paquetes, 0);
  const sinUbicar = seleccionadas.filter(c => !c.ubicacion_confiable).length;
  const fuera = elegibles.length - seleccionadas.length;

  // Para el estado vacío: qué filtro es el culpable. Decir "no hay resultados"
  // sin decir por qué obliga a probar filtros de a uno hasta adivinar.
  const culpable = useMemo(() => {
    if (seleccionadas.length || !elegibles.length) return null;
    const porMinimo = elegibles.filter(c => c.paquetes < minPaquetes).length;
    const porMunicipio = municipio !== "todos"
      ? elegibles.filter(c => c.municipio !== municipio).length : 0;
    const porUbicacion = soloUbicadas ? elegibles.filter(c => !c.ubicacion_confiable).length : 0;
    const candidatos: Array<{ n: number; texto: string; arreglo: () => void; boton: string }> = [
      { n: porMinimo, texto: `El mínimo de ${minPaquetes} paquetes deja fuera ${fmt(porMinimo)} de ${fmt(elegibles.length)}`,
        arreglo: () => setMinPaquetes(minInicial), boton: `Volver a ${minInicial}` },
      { n: porMunicipio, texto: `Ninguna bodega de ${municipio} pasa el resto de los filtros`,
        arreglo: () => setMunicipio("todos"), boton: "Ver todos los municipios" },
      { n: porUbicacion, texto: `Exigir ubicación verificada deja fuera ${fmt(porUbicacion)}`,
        arreglo: () => setSoloUbicadas(false), boton: "Aceptar sin verificar" },
    ].filter(c => c.n > 0).sort((a, b) => b.n - a.n);
    return candidatos[0] ?? null;
  }, [seleccionadas.length, elegibles, minPaquetes, municipio, soloUbicadas, minInicial]);

  const limpiar = () => {
    setBusqueda(""); setMunicipio("todos");
    setMinPaquetes(minInicial); setSoloUbicadas(false); setQuitadas(new Set());
    setOrden("paquetes");
  };

  // "/" enfoca el buscador, "Esc" limpia. Quien revisa esto todos los días no
  // debería tener que ir al mouse para filtrar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const enCampo = /^(INPUT|SELECT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if (e.key === "/" && !enCampo) { e.preventDefault(); buscador.current?.focus(); }
      if (e.key === "Escape" && enCampo) { (e.target as HTMLElement).blur(); limpiar(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  /** Deja solo las N más grandes: el volumen se concentra arriba. */
  function soloTop(n: number) {
    const conservar = new Set([...elegibles].sort((a, b) => b.paquetes - a.paquetes)
      .slice(0, n).map(c => c.warehouse_id));
    setQuitadas(new Set(elegibles.filter(c => !conservar.has(c.warehouse_id)).map(c => c.warehouse_id)));
    setBusqueda(""); setMunicipio("todos"); setSoloUbicadas(false); setMinPaquetes(1);
  }

  const hoy = () => new Date().toISOString().slice(0, 10);

  function descargar() {
    try {
      const csv = generarCsv(seleccionadas.map(c => ({
        warehouse_id: c.warehouse_id,
        bodega: c.nombre,
        direccion: c.direccion,
        municipio: c.municipio,
        dpto: c.dpto,
        cod_dane: c.cod_dane,
        paquetes: c.paquetes,
        contacto_nombre: null,
        contacto_telefono: c.telefono,
        ventana_desde: null,
        ventana_hasta: null,
        ubicacion_confiable: c.ubicacion_confiable,
        lat: c.lat,
        lng: c.lng,
      })));

      // Blob + link temporal: la descarga la dispara el navegador, sin pasar por
      // el servidor. El archivo lleva data operativa y no tiene por qué viajar
      // dos veces ni quedar en logs de red.
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo(transportadora, hoy());
      a.click();
      URL.revokeObjectURL(url);
      setAviso({ texto: `Archivo con ${fmt(seleccionadas.length)} bodegas descargado`, tono: "ok" });
    } catch (e) {
      setAviso({ texto: `No se pudo generar el archivo: ${e instanceof Error ? e.message : "error"}`, tono: "error" });
    }
  }

  async function copiarMensaje() {
    const texto = mensajeSolicitud({
      transportadora,
      fecha: hoy(),
      bodegas: seleccionadas.length,
      paquetes,
      municipios: [...new Set(seleccionadas.map(c => c.municipio))],
    });

    // navigator.clipboard NO existe fuera de HTTPS — y en red local es lo normal.
    // Sin este respaldo el botón no hace nada y parece que el sistema falla.
    try {
      if (!navigator.clipboard) throw new Error("sin API de portapapeles");
      await navigator.clipboard.writeText(texto);
      setCopiaManual(null);
      setAviso({ texto: "Mensaje copiado", tono: "ok" });
    } catch {
      setCopiaManual(texto);
      setAviso({ texto: "No se pudo copiar solo — el texto quedó abajo para copiarlo a mano", tono: "error" });
    }
  }

  const encabezado = (clave: Orden, etiqueta: string, alineado?: "num") => (
    <th className={alineado === "num" ? "num" : undefined} aria-sort={orden === clave ? "descending" : "none"}>
      <button className="sol-orden" onClick={() => setOrden(clave)} aria-pressed={orden === clave}>
        {etiqueta}{orden === clave && <span aria-hidden="true"> ↓</span>}
      </button>
    </th>
  );

  return (
    <div className="sol">
      <div className="sol-filtros">
        <input
          ref={buscador}
          type="search"
          className="sol-input"
          placeholder="Buscar bodega, municipio o dirección…   ( / )"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          aria-label="Buscar entre las bodegas elegibles"
        />

        <select
          className="sol-input"
          value={municipio}
          onChange={e => setMunicipio(e.target.value)}
          aria-label="Filtrar por municipio"
        >
          <option value="todos">Todos los municipios ({municipios.length})</option>
          {municipios.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <label className="sol-min">
          Mínimo
          <input
            type="number"
            min={1}
            className="sol-input sol-input--num"
            value={minPaquetes}
            onChange={e => setMinPaquetes(Math.max(1, Number(e.target.value) || 1))}
          />
          paquetes
        </label>

        <label className="sol-check">
          <input
            type="checkbox"
            checked={soloUbicadas}
            onChange={e => setSoloUbicadas(e.target.checked)}
          />
          Solo con ubicación verificada
        </label>

        {elegibles.length > 50 && (
          <button className="sol-limpiar" onClick={() => soloTop(50)}>
            Solo las 50 más grandes
          </button>
        )}
        {fuera > 0 && (
          <button className="sol-limpiar" onClick={limpiar}>Limpiar filtros</button>
        )}
      </div>

      {/* El resumen es el corazón de la pantalla: dice qué se va a pedir ANTES
          de generar nada. role=status para que un lector de pantalla anuncie el
          cambio al filtrar — pasa de 363 a 57 y en silencio no se entera. */}
      <div className="sol-resumen">
        <div className="sol-cuenta" role="status" aria-live="polite">
          <b className="tnum">{fmt(seleccionadas.length)}</b> bodegas ·{" "}
          <b className="tnum">{fmt(paquetes)}</b> paquetes
          {fuera > 0 && (
            <span className="sol-fuera"> — {fmt(fuera)} fuera por los filtros</span>
          )}
        </div>

        {sinUbicar > 0 && (
          <span className="sol-aviso">
            {fmt(sinUbicar)} van sin coordenada · el conductor se guía por la dirección
          </span>
        )}

        <div className="sol-acciones">
          <button className="sol-btn" onClick={copiarMensaje} disabled={!seleccionadas.length}>
            Copiar mensaje
          </button>
          <button className="sol-btn sol-btn--primary" onClick={descargar} disabled={!seleccionadas.length}>
            Descargar archivo ({fmt(seleccionadas.length)})
          </button>
        </div>
      </div>

      {aviso && (
        <p className={`sol-feedback sol-feedback--${aviso.tono}`} role="status" aria-live="polite">
          {aviso.texto}
        </p>
      )}

      {copiaManual && (
        <textarea
          className="sol-copia-manual"
          readOnly
          rows={4}
          value={copiaManual}
          onFocus={e => e.currentTarget.select()}
          aria-label="Mensaje para copiar manualmente"
        />
      )}

      {quitadas.size > 0 && (
        <p className="sol-quitadas">
          {quitadas.size} quitada{quitadas.size > 1 ? "s" : ""} ·{" "}
          <button className="sol-link" onClick={() => setQuitadas(new Set())}>restaurar</button>
        </p>
      )}

      {seleccionadas.length > 0 ? (
        <>
          <div className="rec-tabla-wrap">
            <table className="rec-tabla">
              <thead>
                <tr>
                  {encabezado("nombre", "Bodega")}
                  {encabezado("municipio", "Municipio")}
                  {encabezado("paquetes", "Paquetes", "num")}
                  <th>Ubicación</th>
                  <th aria-label="Quitar" />
                </tr>
              </thead>
              <tbody>
                {seleccionadas.slice(0, VISIBLES).map(c => (
                  <tr key={c.warehouse_id}>
                    {/* La dirección va bajo el nombre y no en su propia columna:
                        es lo más largo de la fila y como columna empujaría las
                        cifras fuera de la pantalla. */}
                    <td>
                      <span className="sol-bodega">{c.nombre}</span>
                      <span className="sol-dir" title={c.direccion}>
                        {c.direccion || "sin dirección registrada"}
                      </span>
                    </td>
                    <td>{c.municipio}</td>
                    <td className="num tnum">{fmt(c.paquetes)}</td>
                    <td>
                      {c.ubicacion_confiable
                        ? <span className="rec-ok">verificada</span>
                        : <span className="rec-warn">sin ubicar</span>}
                    </td>
                    <td className="num">
                      <button
                        className="sol-quitar"
                        onClick={() => setQuitadas(prev => new Set(prev).add(c.warehouse_id))}
                        aria-label={`Quitar ${c.nombre} de la solicitud`}
                      >
                        quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {seleccionadas.length > VISIBLES && (
            <p className="rec-mas">
              Se muestran {VISIBLES} de {fmt(seleccionadas.length)}. El archivo lleva todas.
            </p>
          )}
        </>
      ) : (
        // Un estado vacío que enseña: nombra el filtro culpable y trae el arreglo.
        <div className="sol-vacio">
          <b>Ninguna bodega pasa estos filtros</b>
          {culpable && (
            <>
              <span>{culpable.texto}.</span>
              <button className="sol-btn" onClick={culpable.arreglo}>{culpable.boton}</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
