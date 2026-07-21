// Mapeo PM (assignee de Jira) → célula. Es un parche mientras el campo "Celula"
// (customfield_10783) de Jira siga vacío en todos los tickets — ver hallazgos en
// conversación del 2026-07-16. Cuando el equipo empiece a diligenciar ese campo,
// esta tabla deja de ser necesaria.
//
// Algunos PMs trabajan en más de una célula (Michel Pino: Logistics + Backoffice;
// Catalina Giraldo: Backoffice + Experience). Para esos casos no hay forma de
// desambiguar solo con el assignee — un ticket suyo puede ser de cualquiera de
// sus dos células. Se listan como array; el llamador decide cómo tratarlos
// (excluir del conteo automático, marcar "requiere revisión manual", etc.).
export const PM_A_CELULA: Record<string, string[]> = {
  "Alejandra Melo Salazar": ["Sellers Success"],
  "Santiago Herrera Acosta": ["Sellers Success"],
  "Francisco Velandia": ["Brands Success"],
  "Katerine Pencue Avila": ["Brands Success"],
  "Michelle López Obregón": ["Suppliers Success"],
  "Jaime Guevara": ["Suppliers Success"],
  "Juan Diego Bautista Vasquez": ["Logistics Success"],
  "Paula Andrea Macias Gonzalez": ["Backoffice"],
  "Nicolas Vargas Galindo": ["Fintech"],
  "kevin.paternina": ["Experience"],
  // Diana Aldana y Lina Jiménez: nombre exacto de Jira sin confirmar (no aparecieron en la
  // muestra de junio explorada el 2026-07-16). Si su assignee.displayName real es distinto
  // a este string, sus tickets van a caer en "sin clasificar" en /jira-apoyo — revisar ahí
  // y corregir esta entrada con el nombre real la primera vez que aparezcan.
  "Diana Aldana": ["Experience"],
  "Lina Jimenez": ["Estrellas"],
  // Omar Saldarriaga se movió de Brands a Estrellas (roster actualizado 2026-07-17).
  "Omar Fernando Saldarriaga Gómez": ["Estrellas"],
  // Ambiguos — un mismo PM cubre dos células, no se puede resolver solo con assignee.
  "Michel Pino": ["Logistics Success", "Backoffice"],
  "Catalina Giraldo Aguirre": ["Backoffice", "Experience"],
};

export function celulasDeAssignee(displayName: string | null | undefined): string[] {
  if (!displayName) return [];
  return PM_A_CELULA[displayName] ?? [];
}
