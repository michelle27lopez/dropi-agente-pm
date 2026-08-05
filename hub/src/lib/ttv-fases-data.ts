// TTV-001 — métricas por fase (Levantamiento inicial vs. Pipeline CRM/GHL)
// Fuente única compartida entre /proyectos/time-to-value/asis y el home de Suppliers.
// Actualizar aquí cuando cambien los números — no los dupliques en las páginas.

export const TTV_FASE_1 = {
  periodo: "Línea base histórica · ~90 días (~3 meses) · corte 26-jun-2026",
  registrados: 14175,
  registradosLabel: "14.175",
  registradosSub: "~4.725/mes promedio",
  activados: 255,
  activadosLabel: "255",
  activadosSub: "~85/mes promedio",
  tasaActivacion: "1,80%",
  churn: "26,71%",
};

export const TTV_FASE_2 = {
  periodo: "1-jul a 31-jul-2026 · Dashboard Metabase de Enrique",
  registrados: 944,
  registradosLabel: "944",
  activacionBruta: "4,34%",
  activacionBrutaSub: "41 de 944",
  activacionNeta: "1,91%",
  activacionNetaSub: "18 de 944",
  ratioGeneradasEntregadas: "1,38",
  tiempoRegistroEntrega: "9,94 días",
  fuga: "brecha: crea pero no completa",
  metabaseUrl: "https://n8n-metabase.ojjmzk.easypanel.host/public/dashboard/962c8049-621d-4f8c-b88c-4d164de0e885?fecha=&ruta=",
};

export const TTV_COMPARACION = {
  texto: "Fase 1 = 1,80% (255 de 14.175) · Fase 2 neta (1-jul a 31-jul) = 1,91% (18 de 944). " +
    "La activación neta ya supera el baseline histórico, y lo hace con menos volumen bruto que el corte " +
    "anterior (4,34% genera orden vs. 9,54% antes) — señal de que el pipeline está filtrando mejor, no solo " +
    "generando más ruido. La brecha entre \"genera orden\" y \"la entrega\" (41→18, ratio 1,38) sigue siendo " +
    "el punto a cerrar, y es la razón del pivote a un agente de WA que filtre por comportamiento real antes " +
    "del contacto humano.",
  ojoUniverso: "Fase 1 mide sobre el total histórico de UserPilot (14.175); Fase 2 mide sobre los registrados " +
    "que llegaron al CRM en jul-2026 (944) — son poblaciones distintas (todo Userpilot vs. solo los que " +
    "entraron al pipeline en el mes). La comparación es la más cercana posible con lo que hoy se mide en " +
    "cada fase, no una tasa perfectamente equivalente.",
};
