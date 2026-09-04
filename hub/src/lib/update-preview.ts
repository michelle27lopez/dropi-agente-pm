function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/[\s·]+$/, "") + "…";
}

// Limpia los tokens de formato ("## ", "- ", líneas "---") antes de recortar
// para la fila/tarjeta de la lista — el modal sí los interpreta, la lista
// solo necesita texto corrido. Las viñetas ("- ") suelen ser pares
// etiqueta: valor (ej. "Fase: Delivery | En QA") — unirlas con un simple
// espacio las pegaba en un bloque ilegible ("Fase: X Prioridad: Y..."), así
// que cada viñeta cierra con " · " para separarlas visualmente.
function stripMarkup(text: string) {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "---")
    .map((line) => {
      const noHeading = line.replace(/^#+\s*/, "");
      const isBullet = /^-\s+/.test(noHeading);
      const clean = noHeading.replace(/^-\s*/, "");
      return isBullet ? `${clean} ·` : clean;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s*·\s*$/, "")
    .trim();
}

// Preview de una fila de `celula_updates` para la tarjeta/fila de la lista
// (2026-08-17, Jaime) — el detalle completo se sigue viendo tal cual al abrir
// el modal. La mayoría de `content` es texto libre (markdown a mano), pero al
// menos un registro (Backoffice, semana 28-31 jul) quedó guardado como JSON
// `{"format":"canvas-v1","metricas":[...]}`, y truncarlo crudo mostraba el
// JSON sin parsear como si fuera texto. Se detecta ese formato y se arma un
// resumen legible con las métricas; el resto de contenidos, texto libre,
// sigue truncándose como siempre.
export function previewUpdateContent(content: string): string {
  const trimmed = content.trim();
  if (trimmed.startsWith('{"format"')) {
    try {
      const parsed = JSON.parse(trimmed);
      const metricas: { label?: string; value?: string }[] | undefined = parsed?.metricas;
      if (Array.isArray(metricas) && metricas.length > 0) {
        return truncate(metricas.map((m) => `${m.label}: ${m.value}`).filter(Boolean).join(" · "), 160);
      }
      return "Resumen con métricas — ver detalle.";
    } catch {
      return "Resumen con métricas — ver detalle.";
    }
  }
  return truncate(stripMarkup(content), 160);
}
