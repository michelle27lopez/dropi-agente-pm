import type { CellBoardEntry } from "../types";

// HTML con diseño: agente-delivery/Documentos/cell-board-03sep2026.html
// El objetivo del experimento de las 5 landings se definió en una reunión aparte.
export const entry: CellBoardEntry = {
  weekDate: "2026-09-03",
  title: "Cell Board 03-sep-2026 · PMF segmento Escalando",
  content: `## Qué se quiere lograr

Objetivo de fondo: darle sentido a la célula Brands más allá de la métrica de 600K órdenes — entrar de lleno en discovery y experimentación para descubrir dónde encaja Dropi en la necesidad real del mercado de marcas.

La apuesta concreta: validar si la propuesta de valor a la que queremos llegar —no la actual— hace fit con el segmento Escalando (+1.000 pedidos/mes, podría servir desde 700). Se eligió ese segmento porque ~67 usuarios mueven cerca del 60% del portafolio y porque hoy no hay producto preparado para capturar prospectos de ese tamaño: comercial ya ha tenido que descartar leads por eso.

---
## 1 · Proceso PMF — cómo vamos

Qué está hecho:
— Cerrados los 4 pasos de discovery: selección de segmento, dolores, benchmark competitivo y user persona.
— Base construida: 15 horas de entrevistas, 2 encuestas (una todavía corriendo), análisis competitivo (SkyDrop, 99 Minutos, Melonn).
— La sesión fue una co-creación con Producto + Comercial + Growth + Marketing para sembrar la propuesta de valor de Escalando, no para cerrarla.

Qué falta:
— Consolidar la propuesta de valor y montar las landings.
— Comercial entrega sus insumos tras sincronizarse con la misma segmentación.

---
## 2 · Research — hallazgos

— La retención del núcleo hoy es financiera, no de producto: la marca de alto volumen se queda por COD + pago el mismo día (apalancamiento financiero, sin día fijo de retiro). Es un ancla replicable por la competencia.
— A Escalando le pesan más la reportería y la notificación al cliente — justo lo que no existe.
— Otros dolores: gestión manual de novedades con tasa de solución muy baja, devoluciones medidas en millones (no en cantidad), integración con ERP (Siigo casi lista), fletes sin descuento por volumen ni aviso cuando suben la tarifa.
— Benchmark: Melonn es el más parecido (cobra entrada pero da beneficios de flete por volumen); SkyDrop gana en proactividad y facilidad; 99 Minutos en cobertura end-to-end.
— Deuda técnica relevante solo para este segmento: API sin documentar, sin SLA públicas, Same Day sin oficializar.

---
## 3 · Decisiones de la sesión

— Primero se entiende Dropi, después se incentiva. Laura y Jaime coinciden: el producto tiene que gustar sin promoción; los 3 meses de Chatea Pro y demás incentivos son un paso posterior, no el gancho.
— El diferencial actual no es el del segmento. La landing prueba la propuesta futura (reportería + notificación), no la actual (COD + pago mismo día).
— El roadmap se prioriza por evidencia: cada insight nuevo (notificaciones → tracking → integraciones) se vuelve su propio experimento o POC, se mide, y con eso entra a priorización en comité. Es además munición para pushear un equipo dedicado a marcas.
— Los rangos de segmentación se están moviendo (Pre-Escalando arranca en 500) y falta un lenguaje único entre mantenimiento, captación, CRM, encuesta y landing.
— ATOM: no se le cobra a las marcas por algo que debería ser gratis → definir alianza o módulos básicos.

---
## 4 · Bloqueos

🔴 De proceso, no de producto — mismos que el Cell Board del 27-ago, sin resolver: atención VIP hacia afuera pero las áreas internas no responden VIP; Operaciones y la negociación con transportadoras fuera de la mesa de valor, siendo causa de fugas de marcas reales en 2025.
🟡 Los incentivos que mueven la aguja (descuento de flete por volumen, cashback por crecimiento) no tienen presupuesto comercial aprobado.
🟡 El benchmark de Producto y el de Comercial aún no se han cruzado.

---
## 5 · Accionables

— @Francisco Velandia — consolidar la propuesta de valor sembrada y montar las landings como experimento, con hipótesis y métrica escritas; cruzarlas antes con el benchmark y el cuadro de oferta de valor de Comercial.
— @Katerine Pencue — cerrar el criterio de éxito del experimento (acción de conversión, umbral y tráfico mínimo), bajar el lineamiento único de rangos a todas las áreas y llevar la priorización del roadmap a comité vía experimentos.
— @Enrique López — carriles del CRM al corte de 500; Chatea Pro como oferta de entrada en el carril 500+.
— @Vanessa Garay — aprobación de presupuesto de incentivos y definición del modelo ATOM.
— @Carol / @Katerine Pencue — abrir el espacio de Operaciones + transportadoras en la conversación de valor.

---
## El experimento de la landing · objetivo definido en reunión aparte

Objetivo: vender el producto ideal aunque todavía no exista, y medir si la propuesta es lo bastante relevante para que una marca deje sus datos, y qué tipo de marca se interesa. De ahí sale el roadmap y su justificación.

Formato: cinco landings, una por segmento, cada una con un approach distinto.

Decisiones abiertas — las cierra la célula:
— Acción de conversión: registro en plataforma vs. dejar el dato.
— Criterio de éxito: umbral de conversión y tráfico mínimo.
— A quién se lanza: Jaime propone público frío en redes con audiencia de marketing; lo decide la célula.
— Despliegue: Vercel primero, con Clarity para observar comportamiento.

---
## Lectura ejecutiva

La sesión sembró la propuesta de valor, no la cerró. El siguiente paso es un experimento barato —cinco landings— que responde una sola pregunta: ¿la propuesta es lo bastante relevante para que una marca del núcleo deje sus datos, y qué marca es esa? De esa respuesta depende si se invierte en desarrollo. El research de Producto ya valida lo que Comercial viene pidiendo hace más de un año, así que la justificación existe; lo que falta es la evidencia de demanda. Los bloqueos que destruyen valor son de proceso y ya conocidos.`,
};
