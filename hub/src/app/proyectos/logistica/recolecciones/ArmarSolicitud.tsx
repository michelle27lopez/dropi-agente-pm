"use client";

import { useMemo, useState } from "react";
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

const fmt = (n: number) => n.toLocaleString("es-CO");

export default function ArmarSolicitud({ transportadora, elegibles, minInicial }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [municipio, setMunicipio] = useState("todos");
  const [minPaquetes, setMinPaquetes] = useState(minInicial);
  const [soloUbicadas, setSoloUbicadas] = useState(false);
  const [quitadas, setQuitadas] = useState<Set<string>>(new Set());

  const municipios = useMemo(
    () => [...new Set(elegibles.map(c => c.municipio))].filter(Boolean).sort(),
    [elegibles],
  );

  const seleccionadas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return elegibles.filter(c => {
      if (quitadas.has(c.warehouse_id)) return false;
      if (c.paquetes < minPaquetes) return false;
      if (municipio !== "todos" && c.municipio !== municipio) return false;
      if (soloUbicadas && !c.ubicacion_confiable) return false;
      if (q && !(`${c.nombre} ${c.municipio} ${c.direccion}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [elegibles, busqueda, municipio, minPaquetes, soloUbicadas, quitadas]);

  const paquetes = seleccionadas.reduce((s, c) => s + c.paquetes, 0);
  const sinUbicar = seleccionadas.filter(c => !c.ubicacion_confiable).length;
  const fuera = elegibles.length - seleccionadas.length;

  const limpiar = () => {
    setBusqueda(""); setMunicipio("todos");
    setMinPaquetes(minInicial); setSoloUbicadas(false); setQuitadas(new Set());
  };

  const quitar = (id: string) =>
    setQuitadas(prev => new Set(prev).add(id));

  function descargar() {
    const hoy = new Date().toISOString().slice(0, 10);
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
    a.download = nombreArchivo(transportadora, hoy);
    a.click();
    URL.revokeObjectURL(url);
  }

  function copiarMensaje() {
    const hoy = new Date().toISOString().slice(0, 10);
    navigator.clipboard?.writeText(mensajeSolicitud({
      transportadora,
      fecha: hoy,
      bodegas: seleccionadas.length,
      paquetes,
      municipios: [...new Set(seleccionadas.map(c => c.municipio))],
    }));
  }

  return (
    <div className="sol">
      <div className="sol-filtros">
        <input
          type="search"
          className="sol-input"
          placeholder="Buscar bodega, municipio o dirección…"
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

        {fuera > 0 && (
          <button className="sol-limpiar" onClick={limpiar}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* El resumen es el corazón de la pantalla: dice qué se va a pedir ANTES
          de generar nada, y cuánto se dejó fuera al filtrar. */}
      <div className="sol-resumen">
        <div className="sol-cuenta">
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

      {quitadas.size > 0 && (
        <p className="sol-quitadas">
          {quitadas.size} quitada{quitadas.size > 1 ? "s" : ""} a mano ·{" "}
          <button className="sol-link" onClick={() => setQuitadas(new Set())}>restaurar</button>
        </p>
      )}

      <div className="rec-tabla-wrap">
        <table className="rec-tabla">
          <thead>
            <tr>
              <th>Bodega</th>
              <th>Municipio</th>
              <th className="num">Paquetes</th>
              <th>Ubicación</th>
              <th aria-label="Quitar" />
            </tr>
          </thead>
          <tbody>
            {seleccionadas.slice(0, 60).map(c => (
              <tr key={c.warehouse_id}>
                <td>{c.nombre}</td>
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
                    onClick={() => quitar(c.warehouse_id)}
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

      {seleccionadas.length > 60 && (
        <p className="rec-mas">
          Se muestran 60 de {fmt(seleccionadas.length)}. El archivo lleva todas.
        </p>
      )}
      {!seleccionadas.length && (
        <p className="rec-mas">Ninguna bodega pasa estos filtros.</p>
      )}
    </div>
  );
}
