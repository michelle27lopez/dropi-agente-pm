"use client";

import { useEffect } from "react";

// Botón "Descargar PDF". Usa el diálogo de impresión del navegador con estilos
// @media print, así el PDF sale idéntico a lo que se ve (texto vectorial, nítido).
// En el diálogo elegir "Guardar como PDF".
// docTitle: el navegador usa document.title como nombre de archivo sugerido; se
// cambia solo mientras dura el diálogo y se restaura para no ensuciar la pestaña.
export default function PrintButton({ label = "Descargar PDF", docTitle }: { label?: string; docTitle?: string }) {
  useEffect(() => {
    if (!docTitle) return;
    const original = document.title;
    const before = () => { document.title = docTitle.replace(/[\\/:*?"<>|]/g, "-"); };
    const after = () => { document.title = original; };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
      document.title = original;
    };
  }, [docTitle]);

  return (
    <button type="button" className="pdf-btn no-print" onClick={() => window.print()} title="Abre el diálogo de impresión — elige “Guardar como PDF”">
      <span aria-hidden>⬇︎</span> {label}
    </button>
  );
}
