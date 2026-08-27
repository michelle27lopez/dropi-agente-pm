// Resultados de iniciativas — panel "Resumen" de Following · Suppliers.
// Números que Jaime lleva a mano por iniciativa. Actualizar aquí; no duplicar
// en la página. `null` = dato aún pendiente de recibir/validar (se muestra
// como "—" con nota).

export const TTV_RESULTADOS = {
  // Corte "en lo corrido del día" — Jaime lo actualiza cuando llega el dato.
  proveedoresActivos: "91",
  diasActivacionNeta: "15 días", // registro → 1ª orden neta
  ordenesGeneradas: null as string | null, // pendiente: "en lo corrido del día te mando el dato"
  ordenesGeneradasNota: "Dato del día — pendiente por confirmar",
};

export const PULSO_RESULTADOS = {
  senalesEnviadas: "10",
  productosAceptadosPrivatizar: "160",
  ordenesGeneradas: null as string | null,
  ordenesGeneradasNota: "Pendiente por validar si se generaron órdenes",
  detalleUrl: "/proyectos/pulso-demo",
};
