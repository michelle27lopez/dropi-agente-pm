// Los tamaños de la escala, en número.
//
// La ley del tablero permite cinco tamaños y ninguno más, definidos como
// tokens CSS (`--fs-label`, `--fs-body`…). Dentro de un SVG de recharts no se
// pueden usar: `tick`, `LabelList` y `label` reciben atributos de presentación
// SVG, que no resuelven `var()`. Así que se repiten aquí como número, con el
// token al lado, y los charts importan de acá en vez de escribir un px suelto.
export const FS_LABEL = 11; // --fs-label
export const FS_BODY = 13; // --fs-body
