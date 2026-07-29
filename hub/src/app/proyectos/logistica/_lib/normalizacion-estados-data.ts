/**
 * NORMALIZACIÓN DE ESTADOS — una homologación, dos audiencias.
 *
 *   CRUDO (51)  ──►  ADMIN DROPI (24)  ──►  DROPSHIPPER Y PROVEEDOR (13)
 *   lo que llega     con esto se opera       lo que ve quien vende
 *                    y se mide cada tramo
 *
 * Las audiencias son dos y solo dos (Juan, 29-jul): **dropshippers y proveedores**, y **admin
 * Dropi**. No se modela una vista de cliente final.
 *
 * Los 24 NO son una capa de más: son el entregable del proyecto — el vocabulario con el que la
 * operación trabaja y mide. Los 13 son lo mismo, resumido para quien vende. Se muestran con UN
 * interruptor, nunca los dos a la vez.
 *
 * El 29-jul se borraron los 24 por error: la página quedó entregándole a la operación una simple
 * agrupación de estados crudos, que es justo el problema que este proyecto existe para resolver.
 *
 * Regla de escritura: nada de nombres de tablas, endpoints ni jerga interna.
 */

export type Tone = "info" | "exito" | "alerta" | "critico" | "neutral";
export type Vista = "operacion" | "usuario";

export type Flecha = { id: string; path: string; tone: Tone };

/** Un estado del nivel OPERACIÓN. `usuario` es en cuál de los 9 cae; null = el cliente no lo ve. */
export type EstadoOperacion = {
  id: string;
  nombre: string;
  x: number;
  y: number;
  tone: Tone;
  quienLoGenera: string;
  queSignifica: string;
  usuario: string | null;
  crudos: string[];
};

export const operacion: EstadoOperacion[] = [
  { id: "confirm", nombre: "Por confirmar", x: 30, y: 70, tone: "info", quienLoGenera: "Dropshipper", queSignifica: "La orden existe y espera confirmación.", usuario: "confirmar", crudos: ["PENDIENTE CONFIRMACION"] },
  { id: "pending", nombre: "Pendiente", x: 190, y: 70, tone: "info", quienLoGenera: "Proveedor", queSignifica: "La orden fue confirmada y puede generar guía.", usuario: "pendiente", crudos: ["PENDIENTE"] },
  { id: "guide", nombre: "Guía generada", x: 350, y: 70, tone: "info", quienLoGenera: "Proveedor", queSignifica: "Existe intención logística, pero el paquete todavía no está en red.", usuario: "guia", crudos: ["GUIA_GENERADA", "SIN MOVIMIENTOS"] },
  { id: "pickup-pending", nombre: "Pendiente de recolección", x: 540, y: 70, tone: "alerta", quienLoGenera: "Carrier o Dropi", queSignifica: "Permite medir cuánto tarda la recogida antes del handoff.", usuario: "preparacion", crudos: [] },
  { id: "received", nombre: "Recibido por transportadora", x: 780, y: 70, tone: "info", quienLoGenera: "Transportadora", queSignifica: "Frontera de movilización: el carrier ya tiene el paquete.", usuario: "transito", crudos: ["EN BODEGA TRANSPORTADORA", "MERCANCIA RECOGIDA"] },
  { id: "transit", nombre: "En tránsito", x: 960, y: 70, tone: "info", quienLoGenera: "Transportadora", queSignifica: "El paquete avanza entre origen y destino.", usuario: "transito", crudos: ["EN BODEGA ORIGEN", "DESPACHADA", "EN PROCESAMIENTO", "EN BODEGA DESTINO", "EN TERMINAL DESTINO", "EN TERMINAL ORIGEN", "EN DISTRIBUCION", "EN DESPACHO", "EN RUTA", "BODEGA DESTINO", "EN CAMINO", "EN TRANSITO", "EN TRANSPORTE", "ADMITIDA", "EN ESPERA DE RUTA DOMESTICA", "EN TRASLADO NACIONAL", "REENVÍO", "EN REEXPEDICION", "ASIGNADO", "ENTREGADA A CONEXIONES", "EN ESPERA DE RX", "RECEPCION BODEGA", "ASIGNADO A ZONA", "ASIGNADO A SUCURSAL DESTINO"] },
  { id: "delivery", nombre: "En reparto", x: 1130, y: 70, tone: "info", quienLoGenera: "Transportadora", queSignifica: "El paquete salió a intento de entrega.", usuario: "reparto", crudos: ["EN REPARTO", "INTENTO DE ENTREGA"] },
  { id: "delivered", nombre: "Entregado", x: 1310, y: 70, tone: "exito", quienLoGenera: "Transportadora", queSignifica: "Terminal solo después de una ventana sin rebote.", usuario: "entregado", crudos: ["ENTREGADO"] },
  { id: "prepared", nombre: "Preparado para transportadora", x: 450, y: 205, tone: "info", quienLoGenera: "Proveedor", queSignifica: "ECOM registra que el pedido está listo para salir.", usuario: "preparacion", crudos: ["PREPARADO PARA TRANSPORTADORA"] },
  { id: "ecom-handoff", nombre: "Entregado a transportadora", x: 630, y: 205, tone: "info", quienLoGenera: "Proveedor / ECOM", queSignifica: "El nombre suena a preparación, pero implica salida física de bodega.", usuario: "transito", crudos: ["ENTREGADO A TRANSPORTADORA"] },
  { id: "dropi-pickup", nombre: "Recolectado por Dropi", x: 570, y: 335, tone: "info", quienLoGenera: "Operación Dropi", queSignifica: "Dropi recoge el paquete antes de entregarlo al carrier.", usuario: "transito", crudos: ["RECOGIDO POR DROPI"] },
  { id: "dropi-warehouse", nombre: "En bodega Dropi", x: 750, y: 335, tone: "info", quienLoGenera: "Bodega Dropi", queSignifica: "Paso físico intermedio antes del handoff al carrier.", usuario: "transito", crudos: ["EN BODEGA DROPI"] },
  { id: "pickup-failed", nombre: "Recolección fallida", x: 500, y: 485, tone: "alerta", quienLoGenera: "Carrier o Dropi", queSignifica: "La recogida no ocurrió; el paquete sigue fuera de red.", usuario: "preparacion", crudos: [] },
  { id: "pickup-retry", nombre: "Reintento de recolección", x: 680, y: 485, tone: "alerta", quienLoGenera: "Operación", queSignifica: "Nuevo intento antes de declarar la orden sin movilización.", usuario: "preparacion", crudos: [] },
  { id: "office", nombre: "Disponible para retiro", x: 1110, y: 205, tone: "alerta", quienLoGenera: "Transportadora", queSignifica: "El paquete espera al cliente en oficina o punto físico.", usuario: "retiro", crudos: ["RECLAME EN OFICINA", "EN PUNTO DROOP"] },
  { id: "novelty", nombre: "Novedad", x: 1010, y: 335, tone: "alerta", quienLoGenera: "Transportadora / operación", queSignifica: "Un intento falló o apareció una incidencia recuperable.", usuario: "novedad", crudos: ["NOVEDAD", "TELEMERCADEO"] },
  { id: "retry", nombre: "Reintento de entrega", x: 1190, y: 335, tone: "alerta", quienLoGenera: "Transportadora", queSignifica: "La guía vuelve a reparto después de resolver la novedad.", usuario: "reparto", crudos: [] },
  { id: "solved", nombre: "Novedad solucionada", x: 1360, y: 335, tone: "exito", quienLoGenera: "Operación", queSignifica: "La incidencia se resolvió y la guía puede reingresar al flujo.", usuario: "transito", crudos: ["NOVEDAD SOLUCIONADA"] },
  { id: "sinister", nombre: "Siniestro", x: 850, y: 500, tone: "critico", quienLoGenera: "Transportadora / legal", queSignifica: "Rama transversal por pérdida, daño o incautación.", usuario: "novedad", crudos: [] },
  // usuario: null — decisión de Juan (29-jul): la indemnización es un asunto entre Dropi y la
  // transportadora. El cliente no ve este estado; se queda en el que traía.
  { id: "indemnified", nombre: "Indemnizado", x: 1020, y: 500, tone: "critico", quienLoGenera: "Legal / financiero", queSignifica: "Cierre del siniestro después del proceso de indemnización.", usuario: null, crudos: ["EN PROCESO DE INDEMNIZACION"] },
  { id: "returning", nombre: "En devolución", x: 1190, y: 500, tone: "alerta", quienLoGenera: "Transportadora", queSignifica: "El paquete retorna hacia la bodega o proveedor.", usuario: "devolucion", crudos: ["DEVOLUCION", "EN PROCESO DE DEVOLUCION", "TRANSITO A DEVOLUCION PROVEEDOR", "DEVOLUCION EN RUTA"] },
  { id: "returned", nombre: "Devolución confirmada", x: 1360, y: 500, tone: "neutral", quienLoGenera: "Bodega / proveedor", queSignifica: "El cierre ocurre cuando bodega confirma la recepción física.", usuario: "devuelto", crudos: ["DEVOLUCION EN BODEGA"] },
  { id: "rejected", nombre: "Rechazado", x: 190, y: 500, tone: "critico", quienLoGenera: "Proveedor", queSignifica: "La orden no entra al flujo logístico.", usuario: "rechazado", crudos: ["RECHAZADO"] },
  { id: "cancelled", nombre: "Cancelado", x: 350, y: 500, tone: "critico", quienLoGenera: "Dropshipper / sistema", queSignifica: "La orden se cierra antes del handoff.", usuario: "cancelado", crudos: ["GUIA_ANULADA", "CANCELADO"] },
];

export const flechasOperacion: Flecha[] = [
{ id: "confirm-pending", path: "M170 102 L190 102", tone: "info" },
  { id: "pending-guide", path: "M330 102 L350 102", tone: "info" },
  { id: "guide-direct", path: "M490 102 L540 102", tone: "info" },
  { id: "direct-received", path: "M680 102 C715 102 735 102 780 102", tone: "info" },
  { id: "guide-ecom", path: "M420 134 C420 165 450 165 450 205", tone: "info" },
  { id: "prepared-handoff", path: "M590 237 L630 237", tone: "info" },
  { id: "ecom-received", path: "M770 237 C800 237 745 135 780 102", tone: "info" },
  { id: "handoff-dropi", path: "M700 269 C700 305 640 300 640 335", tone: "info" },
  { id: "dropi-warehouse", path: "M710 367 L750 367", tone: "info" },
  { id: "warehouse-pending", path: "M820 335 C820 245 610 245 610 134", tone: "info" },
  { id: "pending-received-dropi", path: "M680 102 C715 102 735 102 780 102", tone: "info" },
  { id: "received-transit", path: "M920 102 L960 102", tone: "info" },
  { id: "transit-delivery", path: "M1100 102 L1130 102", tone: "info" },
  { id: "delivery-delivered", path: "M1270 102 L1310 102", tone: "info" },
  { id: "pickup-failed", path: "M610 134 C610 260 570 390 570 485", tone: "alerta" },
  { id: "failed-retry", path: "M640 517 L680 517", tone: "alerta" },
  { id: "retry-pickup", path: "M750 485 C750 390 640 250 610 134", tone: "alerta" },
  { id: "transit-office", path: "M1030 134 C1030 180 1110 170 1110 205", tone: "alerta" },
  { id: "office-delivered", path: "M1250 237 C1350 237 1380 170 1380 134", tone: "alerta" },
  { id: "delivery-novelty", path: "M1200 134 C1200 240 1080 245 1080 335", tone: "alerta" },
  { id: "novelty-retry", path: "M1150 367 L1190 367", tone: "alerta" },
  { id: "retry-delivery", path: "M1260 335 C1260 270 1200 215 1200 134", tone: "alerta" },
  { id: "novelty-solved", path: "M1150 385 C1220 430 1360 430 1430 399", tone: "alerta" },
  { id: "solved-delivery", path: "M1430 335 C1430 230 1200 240 1200 134", tone: "alerta" },
  { id: "transit-sinister", path: "M1030 134 C1030 310 920 360 920 500", tone: "critico" },
  { id: "sinister-indemnified", path: "M990 532 L1020 532", tone: "critico" },
  { id: "novelty-return", path: "M1080 399 C1080 465 1190 450 1190 500", tone: "alerta" },
  { id: "return-returned", path: "M1330 532 L1360 532", tone: "alerta" },
  { id: "pending-rejected", path: "M260 134 L260 500", tone: "critico" },
  { id: "guide-cancelled", path: "M420 134 L420 500", tone: "critico" },
];

/** Un estado del nivel USUARIO. Sus crudos y sus estados de operación se derivan, no se escriben. */
export type EstadoUsuario = { id: string; nombre: string; x: number; y: number; tone: Tone; queSignifica: string };

/**
 * Los 13 del dropshipper y el proveedor. Ajustes de Juan (29-jul):
 *  · «Por confirmar», «Pendiente» y «Guía generada» suben: son SUS acciones, no detalle interno.
 *  · «Rechazado» sale de «Cancelado». Cancelar es decisión propia; que el cliente rechace el
 *    paquete es un resultado del envío. Meterlos juntos le esconde lo que necesita saber.
 * Ya no se modela una vista de cliente final: las audiencias son dropshipper/proveedor y admin.
 */
export const usuario: EstadoUsuario[] = [
  { id: "confirmar", nombre: "Por confirmar", x: 30, y: 30, tone: "info", queSignifica: "La orden llegó y espera que alguien la confirme." },
  { id: "pendiente", nombre: "Pendiente", x: 220, y: 30, tone: "info", queSignifica: "Confirmada, lista para generar la guía." },
  { id: "guia", nombre: "Guía generada", x: 410, y: 30, tone: "info", queSignifica: "Ya hay guía, pero el paquete todavía no está en la red." },
  { id: "preparacion", nombre: "En preparación", x: 600, y: 30, tone: "info", queSignifica: "Alistado y esperando que lo recojan." },
  { id: "transito", nombre: "En tránsito", x: 790, y: 30, tone: "info", queSignifica: "Ya salió y está viajando hacia el cliente." },
  { id: "reparto", nombre: "En reparto", x: 980, y: 30, tone: "info", queSignifica: "Salió a entregarse hoy." },
  { id: "entregado", nombre: "Entregado", x: 1170, y: 30, tone: "exito", queSignifica: "El cliente lo recibió." },
  { id: "retiro", nombre: "Disponible para retiro", x: 980, y: 155, tone: "alerta", queSignifica: "Espera al cliente en un punto físico." },
  { id: "cancelado", nombre: "Cancelado", x: 30, y: 285, tone: "critico", queSignifica: "La orden se cerró antes de salir." },
  { id: "rechazado", nombre: "Rechazado", x: 220, y: 285, tone: "critico", queSignifica: "El cliente no recibió el paquete." },
  { id: "novedad", nombre: "Novedad", x: 600, y: 285, tone: "alerta", queSignifica: "Algo pasó y alguien tiene que resolverlo para que siga." },
  { id: "devolucion", nombre: "En devolución", x: 790, y: 285, tone: "alerta", queSignifica: "Va de regreso al proveedor." },
  { id: "devuelto", nombre: "Devuelto", x: 980, y: 285, tone: "neutral", queSignifica: "Ya volvió y la bodega confirmó que lo recibió." },
];

export const flechasUsuario: Flecha[] = [
  { id: "u-conf-pend", path: "M200 62 L212 62", tone: "info" },
  { id: "u-pend-guia", path: "M390 62 L402 62", tone: "info" },
  { id: "u-guia-prep", path: "M580 62 L592 62", tone: "info" },
  { id: "u-prep-tran", path: "M770 62 L782 62", tone: "info" },
  { id: "u-tran-rep", path: "M960 62 L972 62", tone: "info" },
  { id: "u-rep-ent", path: "M1150 62 L1162 62", tone: "exito" },
  { id: "u-tran-ret", path: "M875 94 C875 135 1065 125 1065 147", tone: "alerta" },
  { id: "u-ret-ent", path: "M1150 187 C1230 187 1255 130 1255 94", tone: "exito" },
  { id: "u-rep-nov", path: "M1020 94 C1020 210 685 205 685 277", tone: "alerta" },
  { id: "u-nov-rep", path: "M770 300 C900 285 1010 200 1040 94", tone: "info" },
  { id: "u-nov-dev", path: "M770 317 L782 317", tone: "alerta" },
  { id: "u-dev-devu", path: "M960 317 L972 317", tone: "neutral" },
  { id: "u-pend-canc", path: "M305 94 C305 175 115 205 115 277", tone: "critico" },
  { id: "u-rep-rech", path: "M1020 94 C1020 240 305 235 305 277", tone: "critico" },
];

export const operacionPorId = new Map(operacion.map((e) => [e.id, e]));
export const usuarioPorId = new Map(usuario.map((e) => [e.id, e]));

/** Los estados de operación que caen en un estado de usuario. */
export const operacionDe = (idUsuario: string) => operacion.filter((o) => o.usuario === idUsuario);
/** Los crudos que caen en un estado de usuario, pasando por los de operación. */
export const crudosDe = (idUsuario: string) => operacionDe(idUsuario).flatMap((o) => o.crudos);

/**
 * Un paso de un envío real. `raw` es lo que llegó; `estado` es el estado de OPERACIÓN al que
 * corresponde. Si es null, ese texto llegó y no tiene homologado: es un hallazgo, no un error.
 * Los identificadores de envío son anónimos — eran números de guía reales.
 */
export type Paso = { raw: string; estado: string | null };
export type Envio = { id: string; carrier: string; outcome: "Entregado" | "Devolución"; highlight: string; steps: Paso[] };

const p = (raw: string, estado: string): Paso => ({ raw, estado });
const u = (raw: string): Paso => ({ raw, estado: null });

export const envios: Envio[] = [
  { id: "Envío 01", carrier: "INTERRAPIDISIMO", outcome: "Devolución", highlight: "Proceso finalizado no fue terminal", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), u("Proceso finalizado"), p("Cancelado", "cancelled"), p("Devolución", "returning")] },
  { id: "Envío 02", carrier: "INTERRAPIDISIMO", outcome: "Devolución", highlight: "Novedad termina en devolución", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Devolución", "returning")] },
  { id: "Envío 03", carrier: "COORDINADORA", outcome: "Entregado", highlight: "Novedades y reintentos recuperan la entrega", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("En reparto", "delivery"), p("Novedad solucionada", "solved"), p("En reparto", "delivery"), p("Entregado", "delivered")] },
  { id: "Envío 04", carrier: "COORDINADORA", outcome: "Devolución", highlight: "Usa recolección Dropi", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recolectado por Dropi", "dropi-pickup"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Devolución", "returning")] },
  { id: "Envío 05", carrier: "COORDINADORA", outcome: "Devolución", highlight: "Dos novedades solucionadas no evitaron devolución", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Novedad solucionada", "solved"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Novedad solucionada", "solved"), p("Devolución", "returning")] },
  { id: "Envío 06", carrier: "ENVIA", outcome: "Devolución", highlight: "Tres ciclos novedad-solución", steps: [p("Pendiente", "pending"), p("Guía generada", "guide"), p("En preparación", "prepared"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Novedad solucionada", "solved"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Novedad solucionada", "solved"), p("Novedad", "novelty"), p("Novedad solucionada", "solved"), p("Devolución", "returning")] },
  { id: "Envío 07", carrier: "ENVIA", outcome: "Devolución", highlight: "Dropi + carrier + novedad", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recolectado por Dropi", "dropi-pickup"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Novedad solucionada", "solved"), p("Devolución", "returning")] },
  { id: "Envío 08", carrier: "99MINUTOS", outcome: "Devolución", highlight: "Ruta ECOM + Dropi completa", steps: [p("Pendiente", "pending"), p("Guía generada", "guide"), p("En preparación", "prepared"), p("Recolectado por Dropi", "dropi-pickup"), p("En bodega Dropi", "dropi-warehouse"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Devolución en proceso", "returning"), p("Devolución", "returning")] },
  { id: "Envío 09", carrier: "99MINUTOS", outcome: "Devolución", highlight: "Dos intentos antes de devolución", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("En preparación", "prepared"), p("Recolectado por Dropi", "dropi-pickup"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Devolución", "returning")] },
  { id: "Envío 10", carrier: "VELOCES", outcome: "Devolución", highlight: "Tres novedades antes del retorno", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recolectado por Dropi", "dropi-pickup"), p("En bodega Dropi", "dropi-warehouse"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Novedad", "novelty"), p("Devolución en proceso", "returning"), p("Devolución", "returning")] },
  { id: "Envío 11", carrier: "VELOCES", outcome: "Entregado", highlight: "Entregado rebotó a reparto", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recolectado por Dropi", "dropi-pickup"), p("En bodega Dropi", "dropi-warehouse"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("Entregado", "delivered"), p("En reparto", "delivery"), p("Entregado", "delivered")] },
  { id: "Envío 12", carrier: "DOMINA", outcome: "Devolución", highlight: "Orden irregular entre carrier y Dropi", steps: [p("Pendiente", "pending"), p("Guía generada", "guide"), p("En preparación", "prepared"), p("Recibido transportadora", "received"), p("Recolectado por Dropi", "dropi-pickup"), p("En bodega Dropi", "dropi-warehouse"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("Novedad solucionada", "solved"), p("Devolución", "returning")] },
  { id: "Envío 13", carrier: "DOMINA", outcome: "Entregado", highlight: "Novedad recuperada", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("En preparación", "prepared"), p("En bodega Dropi", "dropi-warehouse"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("Novedad", "novelty"), p("En reparto", "delivery"), p("Entregado", "delivered")] },
  { id: "Envío 14", carrier: "FUTURA", outcome: "Devolución", highlight: "Reparto y tránsito alternan varias veces", steps: [p("Pendiente confirmación", "confirm"), p("Pendiente", "pending"), p("Guía generada", "guide"), p("Recolectado por Dropi", "dropi-pickup"), p("Recibido transportadora", "received"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("En tránsito", "transit"), p("En reparto", "delivery"), p("En tránsito", "transit"), p("Devolución", "returning")] },
];

/** A qué estado corresponde un paso, según el nivel que se esté mirando. */
export function estadoDelPaso(paso: Paso, nivel: Vista): string | null {
  if (!paso.estado) return null;
  return nivel === "operacion" ? paso.estado : operacionPorId.get(paso.estado)?.usuario ?? null;
}

/** Marca cuándo el recorrido vuelve a un estado por el que ya había pasado. */
export function vueltas(steps: Paso[], nivel: Vista): (number | undefined)[] {
  const visto = new Map<string, number>();
  return steps.map((step, i) => {
    const k = estadoDelPaso(step, nivel);
    if (!k) return undefined;
    if (i > 0 && estadoDelPaso(steps[i - 1], nivel) === k) return undefined;
    const n = (visto.get(k) ?? 0) + 1;
    visto.set(k, n);
    return n > 1 ? n : undefined;
  });
}

export const hallazgos = [
  {
    tone: "critico" as Tone,
    titulo: "Casi nadie confirma que la devolución llegó",
    detalle:
      "11 de los 14 envíos terminan devueltos y en ninguno hay registro de que la bodega recibiera el paquete. Y no es cosa de la muestra: en el tráfico real, de 412 devoluciones solo 27 registran la recepción — 6 de cada 100. Ese registro lo marca el proveedor, no la transportadora.",
  },
  {
    tone: "alerta" as Tone,
    titulo: "«Entregado» no siempre es el final",
    detalle:
      "Hay envíos que aparecen entregados y después vuelven a moverse. Por eso una de las decisiones de hoy es cuánto esperar antes de darlo por cerrado.",
  },
  {
    tone: "alerta" as Tone,
    titulo: "Cinco estados todavía no se pueden medir",
    detalle:
      "Pendiente de recolección, Recolección fallida, Reintento de recolección, Reintento de entrega y Siniestro no tienen ningún dato que los alimente. Media fase de recolección es un hueco de instrumentación, no de homologación — y es justo donde se quería medir cuánto tarda la recogida.",
  },
];

export type Decision = { cuando: "hoy" | "despues"; titulo: string; pregunta: string; propuesta: string };

export const decisiones: Decision[] = [
  {
    cuando: "hoy",
    titulo: "¿Cuándo decimos que una orden está entregada?",
    pregunta: "Hoy una orden puede aparecer entregada y volver a moverse.",
    propuesta:
      "Manda lo que registra Dropi, y se confirma cuando pasan 24 a 48 horas sin un movimiento nuevo. Si mandara lo que reporta la transportadora habría que esperar hasta tres semanas.",
  },
  {
    cuando: "hoy",
    titulo: "¿El reintento es un estado o un contador?",
    pregunta: "Cuando falla una entrega y se vuelve a intentar, ¿es un estado nuevo o el mismo «En reparto» con un número al lado?",
    propuesta: "Contador, para no inflar la lista. Aplica igual para la recolección y la devolución.",
  },
  { cuando: "despues", titulo: "¿Qué mueve cada estado por dentro?", pregunta: "Salida de bodega, efecto en inventario, si se puede devolver atrás.", propuesta: "Hay que completarlo estado por estado antes de entregarle esto a TI." },
  { cuando: "despues", titulo: "¿El modelo aguanta fuera de Colombia?", pregunta: "Solo Colombia está validada con órdenes reales.", propuesta: "Tomar al menos un envío real por país y anotar lo que no encaje." },
  { cuando: "despues", titulo: "Falta medir el estado de la guía", pregunta: "Es la capa con más estados y la única sin medición propia.", propuesta: "Lo que sabemos de ella sale de revisión manual, no de medir el tráfico." },
];
