"use client";

import Link from "next/link";

// Navegación interna del tablero de logística. El logout y la navegación entre
// células los aporta el hub, no esta cabecera.
export default function Header() {
  return (
    <header className="header">
      <Link href="/proyectos/logistica" className="brand">
        <span className="logo">🧭</span>
        <span>
          <span className="name">Tablero PM · Logística</span>
          <br />
          <span className="sub">Logistic Success · Dropi</span>
        </span>
      </Link>
      <nav className="nav">
        <Link href="/proyectos/logistica">Indicadores</Link>
        <Link href="/proyectos/logistica/mapa">Mapa de la orden</Link>
        <Link href="/proyectos/logistica/info-logistica">Info logística</Link>
        <Link href="/proyectos/logistica/normalizacion-estados">Estados</Link>
        <Link href="/proyectos/logistica/experimentos">Experimentos</Link>
        <Link href="/proyectos/logistica/updates">Updates</Link>
        <Link href="/proyectos/logistica/cronograma">Cronograma</Link>
        <Link href="/proyectos/logistica/pendientes">Pendientes</Link>
      </nav>
      <span className="spacer" />
      <span className="updated">Actualizado 17 jul</span>
      <Link href="/celula/logistica" className="updated">← Célula</Link>
    </header>
  );
}
