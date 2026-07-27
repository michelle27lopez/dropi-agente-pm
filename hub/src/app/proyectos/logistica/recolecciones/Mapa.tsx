"use client";

import { useEffect, useRef, useState } from "react";
import type { BodegaConCarga } from "@/lib/recolecciones";
import { esUbicacionReal } from "@/lib/recolecciones";

// El mapa, dentro del módulo — no en una pestaña aparte.
//
// Regla que manda acá: NUNCA se dibuja como punto una bodega cuya ubicación no
// es confiable. Las que están en centroide se juntan en UN marcador por
// municipio, declarado como tal. Esparcirlas por el municipio sería inventar
// ubicaciones, y sobre este mapa alguien decide a qué puerta ir.
//
// Leaflet se carga desde CDN igual que en el prototipo: así no se suma una
// dependencia al bundle del hub y el comportamiento es el mismo que ya estaba
// probado. Si algún día hace falta offline o CSP estricta, se instala por npm
// y solo cambia este archivo.

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

type Props = { bodegas: BodegaConCarga[] };

const fmt = (n: number) => n.toLocaleString("es-CO");

// Superficie mínima de Leaflet, tipada acá en vez de sumar @types/leaflet al
// repo. Son las seis cosas que este componente usa; si el mapa crece hasta
// necesitar más, ahí sí conviene instalar la librería y sus tipos de verdad.
type LatLng = [number, number];
type Capa = { addTo(destino: unknown): Capa; bindTooltip(html: string, opts?: object): Capa };
type MapaLeaflet = {
  setView(c: LatLng, z: number): MapaLeaflet;
  fitBounds(b: unknown, opts?: object): void;
  remove(): void;
};
type Leaflet = {
  map(el: HTMLElement, opts?: object): MapaLeaflet;
  tileLayer(url: string, opts?: object): Capa;
  layerGroup(): Capa;
  marker(c: LatLng, opts?: object): Capa;
  divIcon(opts: object): unknown;
  latLngBounds(cs: LatLng[]): unknown;
};

/** Carga Leaflet una sola vez, aunque el componente se monte de nuevo. */
function cargarLeaflet(): Promise<Leaflet> {
  const w = window as unknown as { L?: Leaflet; __leafletCarga?: Promise<Leaflet> };
  if (w.L) return Promise.resolve(w.L);
  if (w.__leafletCarga) return w.__leafletCarga;

  w.__leafletCarga = new Promise<Leaflet>((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = LEAFLET_JS;
    s.async = true;
    s.onload = () => (w.L ? resolve(w.L) : reject(new Error("Leaflet cargó sin exponer L")));
    s.onerror = () => reject(new Error("no se pudo cargar Leaflet desde unpkg"));
    document.head.appendChild(s);
  });
  return w.__leafletCarga;
}

/** Diámetro del marcador según volumen. Raíz cuadrada: si fuera lineal, una
 *  bodega de 4.700 paquetes taparía media pantalla. */
const tam = (paquetes: number) => Math.max(14, Math.min(46, 12 + Math.sqrt(paquetes) * 1.1));

export default function Mapa({ bodegas }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  const ubicadas = bodegas.filter(b => esUbicacionReal(b.nivel_precision) && b.lat != null && b.lng != null);
  const sinUbicar = bodegas.filter(b => !esUbicacionReal(b.nivel_precision) && b.lat != null && b.lng != null);
  const guiasSinUbicar = sinUbicar.reduce((s, b) => s + b.total, 0);

  useEffect(() => {
    let vivo = true;
    let mapa: MapaLeaflet | null = null;

    cargarLeaflet().then(L => {
      if (!vivo || !contenedor.current) return;

      mapa = L.map(contenedor.current, { scrollWheelZoom: false })
        .setView([4.6, -74.1], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(mapa);

      const capa = L.layerGroup().addTo(mapa);

      // Ubicación confiable: un punto por bodega.
      for (const b of ubicadas) {
        const d = tam(b.total);
        const critica = b.preparadas > 0;
        L.marker([b.lat!, b.lng!], {
          icon: L.divIcon({
            className: "",
            html: `<div class="mapa-mk ${critica ? "mapa-mk--crit" : "mapa-mk--risk"}"
                        style="width:${d}px;height:${d}px"></div>`,
            iconSize: [d, d],
            iconAnchor: [d / 2, d / 2],
          }),
        })
          .bindTooltip(
            `<b>${b.nombre}</b><br>${b.direccion || "sin dirección"}<br>` +
            `${b.municipio} · <b>${fmt(b.total)}</b> paquetes<br>` +
            `<span class="mapa-tt-nota">Nivel de vía — verificar antes de navegar</span>`,
            { direction: "top" },
          )
          .addTo(capa);
      }

      // Sin ubicación confiable: UN marcador por municipio, declarado. No se
      // esparcen por el municipio — eso sería inventar dónde están.
      const porMunicipio = new Map<string, BodegaConCarga[]>();
      for (const b of sinUbicar) {
        const k = b.cod_dane || b.municipio;
        porMunicipio.set(k, [...(porMunicipio.get(k) ?? []), b]);
      }
      for (const grupo of porMunicipio.values()) {
        const total = grupo.reduce((s, b) => s + b.total, 0);
        const d = tam(total);
        L.marker([grupo[0].lat!, grupo[0].lng!], {
          icon: L.divIcon({
            className: "",
            html: `<div class="mapa-mk mapa-mk--sinubicar" style="width:${d}px;height:${d}px">
                     ${grupo.length}</div>`,
            iconSize: [d, d],
            iconAnchor: [d / 2, d / 2],
          }),
        })
          .bindTooltip(
            `<b>${grupo.length} bodega${grupo.length > 1 ? "s" : ""} sin ubicar</b><br>` +
            `${grupo[0].municipio} · <b>${fmt(total)}</b> paquetes<br>` +
            `<span class="mapa-tt-nota">Punto en el centro del municipio, no en la puerta</span>`,
            { direction: "top" },
          )
          .addTo(capa);
      }

      const conCoord = [...ubicadas, ...sinUbicar];
      if (conCoord.length) {
        mapa.fitBounds(L.latLngBounds(conCoord.map(b => [b.lat!, b.lng!] as [number, number])),
          { padding: [30, 30] });
      }
      setListo(true);
    }).catch(e => vivo && setError(e.message));

    return () => { vivo = false; mapa?.remove(); };
  }, [bodegas]);          // se re-dibuja si cambian los datos

  return (
    <section className="mapa">
      <div className="mapa-head">
        <h2>Dónde está la carga</h2>
        <p className="mapa-nota">
          {fmt(ubicadas.length)} bodegas ubicadas ·{" "}
          <b>{fmt(sinUbicar.length)} en el centro de su municipio</b>{" "}
          ({fmt(guiasSinUbicar)} paquetes), agrupadas y marcadas aparte porque no
          sabemos dónde están de verdad.
        </p>
      </div>

      <div className="mapa-caja">
        <div ref={contenedor} className="mapa-lienzo" role="application"
             aria-label="Mapa de bodegas con carga por recoger" />
        {!listo && !error && <div className="mapa-estado">Cargando el mapa…</div>}
        {error && (
          <div className="mapa-estado mapa-estado--error">
            No se pudo cargar el mapa: {error}.<br />
            La lista de arriba sigue funcionando.
          </div>
        )}
      </div>

      <ul className="mapa-leyenda">
        <li><i className="mapa-mk mapa-mk--crit" /> con paquetes preparados</li>
        <li><i className="mapa-mk mapa-mk--risk" /> solo guía generada</li>
        <li><i className="mapa-mk mapa-mk--sinubicar" /> sin ubicación confiable — el punto es el centro del municipio</li>
      </ul>
    </section>
  );
}
