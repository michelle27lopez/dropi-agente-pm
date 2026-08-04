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
  periodo: "Desde 30-jun-2026 · Dashboard Metabase de Enrique (corte 02-ago-2026)",
  registrados: 1090,
  registradosLabel: "1.090",
  activacionBruta: "9,54%",
  activacionBrutaSub: "104 de 1.090",
  activacionNeta: "1,65%",
  activacionNetaSub: "18 de 1.090",
  tiempoOnboarding: "4 días",
  tiempoAuditoria: "3,4 días",
  fuga: "fuga: crea pero no completa",
  metabaseUrl: "https://n8n-metabase.ojjmzk.easypanel.host/public/dashboard/962c8049-621d-4f8c-b88c-4d164de0e885?fecha=&ruta=",
};

export const TTV_COMPARACION = {
  texto: "Fase 1 = 1,80% (255 de 14.175) · Fase 2 neta = 1,65% (18 de 1.090). " +
    "Prácticamente plano — el pipeline capturó mucho más volumen bruto (9,54% genera orden), pero la " +
    "activación real (entregada) no mejoró todavía. La fuga entre \"genera orden\" y \"la entrega\" (104→18) " +
    "es el punto exacto que hay que resolver, y es la razón del pivote a un agente de WA que filtre " +
    "por comportamiento real antes del contacto humano.",
  ojoUniverso: "Fase 1 mide sobre el total histórico de UserPilot (14.175); Fase 2 mide sobre los registrados " +
    "que llegaron al CRM (1.090) — son poblaciones distintas (todo Userpilot vs. solo los que entraron al " +
    "pipeline). La comparación es la más cercana posible con lo que hoy se mide en cada fase, no una tasa " +
    "perfectamente equivalente.",
};
