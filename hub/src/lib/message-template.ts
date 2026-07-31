// Personalización de mensajes de campaña: {{Nombre de columna}} dentro del
// texto se reemplaza por el valor de esa columna en la fila del proveedor.
// Si la columna no existe o está vacía, se deja el placeholder tal cual —
// visible a propósito, para detectar un nombre de columna mal escrito antes
// de enviar en masa en vez de mandar el hueco en blanco.

export function renderMessageTemplate(body: string, row: Record<string, string | number>): string {
  return body.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key: string) => {
    const val = row[key];
    return val !== undefined && val !== null && String(val).trim() !== "" ? String(val) : match;
  });
}

// Nombres de columna que el mensaje referencia vía {{...}}, en el orden en que aparecen.
export function extractTemplateKeys(body: string): string[] {
  const keys: string[] = [];
  for (const match of body.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)) {
    if (!keys.includes(match[1])) keys.push(match[1]);
  }
  return keys;
}
